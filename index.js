var EventEmitter = require('events').EventEmitter;
var util = require('util');

var isMacOrWin = require('os').type() == 'Darwin' || require('os').type().indexOf('Windows') > -1;
var spawn = require('child_process').spawn
var PassThrough = require('stream').PassThrough;
var lame = require('lame');

function Microphone () {
    EventEmitter.call(this);
    this.audioStream = new PassThrough;
    this.infoStream = new PassThrough;

    this.infoStream.on('data', function(data) {
        this.emit('info',
                  data);
    }.bind(this));
    this.audioStream.on('data', function(data) {
        this.emit('audio',
                  {
                      'stream': this.audioStream,
                      'buffer': data
                  });
    }.bind(this));
}

util.inherits(Microphone, EventEmitter);

var ps = null;

Microphone.prototype.startCapture = function(options) {
    options = options || {};
    var alsa_format = options.alsa_format || 'dat',
        alsa_device = options.alsa_device || 'plughw:1,0',
        alsa_addn_args = options.alsa_addn_args || [],
        sox_format = options.sox_format || 'dat',
        sox_addn_args = options.sox_addn_args || [],
        mp3_channels = options.mp3_channels || 2,
        mp3_bitDepth = options.mp3_bitDepth || 16,
        mp3_sampleRate = options.mp3_sampleRate || 44100;

    if(ps == null) {
        ps = isMacOrWin
        ? spawn('sox', ['-d', '-t', sox_format, '-p'].concat(sox_addn_args))
        : spawn('arecord', ['-D', alsa_device, '-f', alsa_format].concat(alsa_addn_args));

        if(options.mp3output === true) {
            var encoder = new lame.Encoder({
                channels: mp3_channels,
                bitDepth: mp3_bitDepth,
                sampleRate: mp3_sampleRate
            });

            ps.stdout.pipe(encoder);

            encoder.pipe(this.audioStream);
            ps.stderr.pipe(this.infoStream);
        } else {

            ps.stdout.pipe(this.audioStream);
            ps.stderr.pipe(this.infoStream);
        }
    }
    this.emit('audio-started', this.audioStream);
};

Microphone.prototype.stopCapture = function() {
    if(ps) {
        ps.kill();
        ps = null;
    }
    this.emit('audio-stopped');
};

module.exports = Microphone;

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
    
    if(ps == null) {
        ps = isMacOrWin
        ? spawn('sox', ['-d', '-t', 'dat', '-p'])
        : spawn('arecord', ['-D', 'plughw:1,0', '-f', 'dat']);

        if(options.mp3output === true) {
            var encoder = new lame.Encoder({
                channels: 2,
                bitDepth: 16,
                sampleRate: 44100
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

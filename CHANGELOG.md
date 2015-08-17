# Change Log
All notable changes to this project will be documented in this file.

[//]: # (### Added)
[//]: # (### Changed)
[//]: # (### Deprecated)
[//]: # (### Removed)
[//]: # (### Fixed)
[//]: # (### Security)

## [Unreleased][unreleased]
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [v2.0.0] - 2015-08-17
### Added
- change log file
- events
- alsa- and SoX devices and encoding options to startCapture(options)

### Changed
- updated example in [README.md](README.md) to show events and the new way to initialize

### Deprecated
- You should not access `mic.audioStream` or `mic.infoStraem` directly anymore, but rather access the data in event-callbacks.

### Removed
### Fixed
### Security

## [v1.0.8] - 2015-01-16

## [v1.0.7] 2015-01-16
### Added
First tagged release.

[unreleased]: https://github.com/hanseartic/node-microphone/compare/v2.0.0...develop
[v2.0.0]: https://github.com/hanseartic/node-microphone/compare/v1.0.8...v2.0.0
[v1.0.8]: https://github.com/hanseartic/node-microphone/compare/v1.0.7...v1.0.8
[v1.0.7]: https://github.com/hanseartic/node-microphone/compare/061a872...v1.0.7
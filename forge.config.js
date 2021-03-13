const path = require('path');

module.exports = {
	packagerConfig: {
		icon: path.join(__dirname, 'src', 'assets', 'icons', 'icon.ico'),
		asar: true,
	},
	makers: [{
		name: '@electron-forge/maker-squirrel',
		config: {
			name: 'Glass-Cannon-Desktop',
			copyright: 'Christian Avi Bulan',
			iconUrl: 'https://raw.githubusercontent.com/christianavi/Glass-Cannon-Desktop/main/src/assets/icons/icon.ico',
			setupIcon: path.join(__dirname, 'src', 'assets', 'icons', 'icon.ico'),
		},
	} ],
	publishers: [{
		name: '@electron-forge/publisher-github',
		config: {
			repository: {
				owner: 'christianavi',
				name: 'Glass-Cannon-Desktop',
			},
			prerelease: true,
		},
	}],
};
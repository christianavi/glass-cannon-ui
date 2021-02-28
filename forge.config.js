const path = require('path')

module.exports = {
    "packagerConfig": {
        "icon": path.join(__dirname, "src", "assets", "icons", "icon.ico")
    },
    "makers": [{
            "name": "@electron-forge/maker-squirrel",
            "config": {
                "name": "Glass-Cannon-Desktop",
                "iconUrl": "https://raw.githubusercontent.com/christianavi/Glass-Cannon-Desktop/main/src/assets/icons/icon.ico",
                "setupIcon": path.join(__dirname, "src", "assets", "icons", "icon.ico")
            }
        },
        {
            "name": "@electron-forge/maker-zip",
            "platforms": [
                "darwin"
            ]
        },
        {
            "name": "@electron-forge/maker-deb",
            "config": {}
        },
        {
            "name": "@electron-forge/maker-rpm",
            "config": {}
        }
    ]
}
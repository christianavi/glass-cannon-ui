const { remote } = require('electron')
const fs = require('fs');
const os = require('os');
const { Client } = require('discord-rpc');
const package = {
  "name": "glass-cannon-desktop",
  "version": "0.1.0",
}

let client = ""
const dir = `${os.homedir}/${process.platform === 'win32' ? '/AppData/Roaming' : '/.config'}`

try {
  if (fs.existsSync(`${dir}/${package.name}`)) {
    if (fs.existsSync(`${dir}/${package.name}/rpc.json`)) {
      const options = require(`${dir}/${package.name}/rpc.json`)
      Object.keys(options).forEach((key) => {
        if (key == "buttons") {
          if (options[key]) {}
          var buttons = options[key]
          if (buttons[0]) {
            document.querySelector('#buttonOneLabel').value = buttons[0].label
            document.querySelector('#buttonOneUrl').value = buttons[0].url
          }
          if (buttons[1]) {
            document.querySelector('#buttonTwoLabel').value = buttons[1].label
            document.querySelector('#buttonTwoUrl').value = buttons[1].url
          }
        } else {
          document.querySelector(`#${key}`).value = options[key];
        }
      })
    }
  } else {
    fs.mkdir(`${dir}/${package.name}`, (err) => {
      if (err) {
        throw err;
      }
    })
  }
} catch (err) {
  console.error(err);
}

const saveDir = `${dir}/${package.name}`

const closeBtn = document.querySelector('#close-button')
const footerBtn = document.querySelector('.modal-footer-button')


let isPresence = false

function init() {
  // Loader
  document.querySelector(".modal-footer-button-label").style.display = "none"
  document.querySelector(".bounce").style.display = "block"

  if (isPresence) {
    client.clearActivity()
    client.destroy()
    isPresence = false
    console.log('Your rich presence has stopped.')
    document.querySelector(".bounce").style.display = "none"
    document.querySelector(".modal-footer-button-label").style.display = "block"
    document.querySelector('.modal-footer-button-label').innerHTML = "Start rich presence"
    footerBtn.classList.remove("red-button")
    footerBtn.classList.add("green-button")
  } else {
    // Client ID check
    client = new Client({ transport: 'ipc' })
    if (!document.querySelector("#clientId").value) {
      var modal = document.querySelector("#modal-body")
      modal.scrollTop = 0;
      modal.focus();
      document.querySelector("#clientId-input-title").style.color = "red";
      document.querySelector("#clientId-input-title").innerHTML = "Client ID - <span class='error'>Please enter a valid Client ID.</span>"
      document.querySelector(".bounce").style.display = "none"
      document.querySelector(".modal-footer-button-label").style.display = "block"
      document.querySelector('.modal-footer-button-label').innerHTML = "Start rich presence"
      return;
    }

    const buttons = []
    if (document.querySelector('#buttonOneLabel').value && document.querySelector('#buttonOneUrl').value) {
      buttons.push({
        label: document.querySelector('#buttonOneLabel').value,
        url: document.querySelector('#buttonOneUrl').value
      })
      if (document.querySelector('#buttonTwoLabel').value && document.querySelector('#buttonTwoUrl').value) {
        buttons.push({
          label: document.querySelector('#buttonTwoLabel').value,
          url: document.querySelector('#buttonTwoUrl').value
        })
      }
    }

    const content = {
      clientId: document.querySelector('#clientId').value,
      details: document.querySelector('#details').value,
      state: document.querySelector('#state').value,
      startTimestamp: document.querySelector('#startTimestamp').value,
      endTimestamp: document.querySelector('#endTimestamp').value,
      largeImageKey: document.querySelector('#largeImageKey').value,
      largeImageText: document.querySelector('#largeImageText').value,
      smallImageKey: document.querySelector('#smallImageKey').value,
      smallImageText: document.querySelector('#smallImageText').value,
      partySize: document.querySelector('#partySize').value,
      partyMax: document.querySelector('#partyMax').value,
      partyId: document.querySelector('#partyId').value,
      joinSecret: document.querySelector('#joinSecret').value,
      buttons: buttons
    }

    const data = JSON.stringify(content, null, 2)
    fs.writeFile(`${saveDir}/rpc.json`, data, (err) => {
      if (err) {
        throw err
      }
    })

    const activity = {}

    activity.clientId = content.clientId
    if (content.details !== '') {
      activity.details = content.details
    }
    if (content.state !== '') {
      activity.state = content.state
    }
    if (content.startTimestamp) {
      activity.startTimestamp = parseInt(content.startTimestamp)
      if (content.endTimestamp) {
        activity.endTimestamp = parseInt(content.endTimestamp)
      }
    }

    if (content.largeImageKey !== '') {
      activity.largeImageKey = content.largeImageKey
      if (content.largeImageText !== '') {
        activity.largeImageText = content.largeImageText
      } else {
        activity.largeImageText = `Glass Cannon Desktop`
      }
    }
    if (content.smallImageKey !== '') {
      activity.smallImageKey = content.smallImageKey
      if (content.smallImageText !== '') {
        activity.smallImageText = content.smallImageText
      } else {
        activity.smallImageText = `https://discord.gg/6kWqUf2x`
      }
    }

    if (content.partyId) {
      activity.partyId = content.partyId
    }

    if (parseInt(content.partySize) && parseInt(content.partyMax)) {
      activity.partySize = parseInt(content.partySize)
      if (parseInt(content.partySize) > parseInt(content.partyMax)) {
        activity.partyMax = parseInt(content.partySize)
      } else {
        activity.partyMax = parseInt(content.partyMax)
      }
    }

    if (content.joinSecret && content.buttons[0]) {
      console.log("Both exists")
      activity.buttons = content.buttons
    } else {
      if (content.joinSecret) {
        activity.joinSecret = content.joinSecret
      }
      if (content.buttons[0]) {
        activity.buttons = content.buttons
      }
    }

    activity.instance = true

    client.on('ready', () => {
      if (!activity.startTimestamp) {
        const startTimestamp = new Date();
        activity.startTimestamp = startTimestamp
      }
      client.setActivity(activity).catch((error) => {
        console.error(error);
        document.querySelector(".bounce").style.display = "none"
        document.querySelector(".modal-footer-button-label").style.display = "block"
        document.querySelector('.modal-footer-button-label').innerHTML = "There was an error"
        footerBtn.classList.add("red-button")
      });

      isPresence = true
      console.log('Your rich presence has started.')
      document.querySelector('.modal-footer-button-label').innerHTML = "Stop rich presence"
      document.querySelector(".bounce").style.display = "none"
      document.querySelector(".modal-footer-button-label").style.display = "block"
      footerBtn.classList.remove("green-button")
      footerBtn.classList.add("red-button")
    })

    client.login({
      clientId: activity.clientId
    })
  }

};

closeBtn.addEventListener("click", function (event) {
  if (event.shiftKey == true) {
    var window = remote.getCurrentWindow();
    window.minimize();

  } else {
    var window = remote.getCurrentWindow();
    window.close();
  }
});

footerBtn.addEventListener("click", function (event) {
  init()
})
var d3 = require('d3-selection');

// Get the various DOM roots.
// var uiBoard = d3.select('#ui-board');
var messageLayer = d3.select('#message-layer');
var messageContainer = messageLayer.select('.message');
var closeMessageButton = messageLayer.select('.close-message-button');

function hideMessageLayer() {
  messageLayer.classed('hidden', true);
}

export function renderMessage({
  message,
  onMessageDismiss
}: {
  message: string;
  onMessageDismiss: () => void;
}) {
  messageLayer.classed('hidden', !message);
  if (message) {
    closeMessageButton.on('click', onCloseButtonClick);
    messageContainer.html(message);
  }

  function onCloseButtonClick() {
    hideMessageLayer();
    onMessageDismiss();
  }
}

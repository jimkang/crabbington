module.exports = [
  {
    id: 'basic',
    xSpace: 64,
    ySpace: 64,
    xOffset: -32,
    yOffset: -32,
    width: 800,
    height: 800,
    color: 'blue'
  },
  {
    id: 'other',
    xSpace: 96,
    ySpace: 32,
    xOffset: -16,
    yOffset: 0,
    width: 600,
    height: 800,
    color: 'red',
    effects: [
      {
        name: 'gravityWarp',
        centers: [[300, 300]],
        strength: 16, // How far it pulls a point at strongest gravity.
        decayDist: 288 // At what point gravity fades completely.
      },
      {
        name: 'gravityWarp',
        centers: [[500, 100], [400, 700]],
        strength: 64, // How far it pulls a point at strongest gravity.
        decayDist: 192 // At what point gravity fades completely.
      }
    ]
  }
  // {
  //   id: 'diagonal',
  //   xSpace: 64,
  //   ySpace: 64,
  //   xOffset: -32,
  //   yOffset: -32,
  //   color: 'orange'
  // },
];

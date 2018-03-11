function renderBlast({ imageContext, transform }, blast) {
  imageContext.strokeStyle = blast.color;
  imageContext.lineWidth = 4;
  imageContext.moveTo(transform.applyX(blast.cx), transform.applyY(blast.cy));
  imageContext.beginPath();
  imageContext.arc(
    transform.applyX(blast.cx),
    transform.applyY(blast.cy),
    transform.k * blast.r,
    0,
    Math.PI * 2
  );
  imageContext.stroke();
}

module.exports = renderBlast;

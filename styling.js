// $(document).ready(function() {
//   $(".node image").each(function() {
//     // Calculate aspect ratio of SVG images
//     var svgHeight = this.getBoundingClientRect().height;
//     var svgWidth = this.getBoundingClientRect().width;
//     var aspectRatio = svgWidth/svgHeight;

//     if (aspectRatio > 1) { // Image is landscape
//       $(this).css({height: "100px"});
//       svgWidth = $(this)[0].getBoundingClientRect().width; // get new width
//       $(this).css({x: -svgWidth/2}); // center image
//     } else { // Image is portrait or square
//       $(this).css({width: "100px"});
//     }
//   });
// });

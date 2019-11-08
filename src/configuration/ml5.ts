//-----------------------------//
// Image Classification        //
//-----------------------------//
// Number of classes to classify
var num_classes = 20;
// Webcam Image size. Must be 227.
var image_size = 227;
// K value for KNN
var topk = 10;
var classes = new Array<string>(num_classes);


 export default { 
  num_classes, 
  image_size,
  topk,
  classes
}
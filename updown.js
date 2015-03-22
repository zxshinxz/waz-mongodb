// Simple wrapper over APIs for uploading and downloading blobs from Windows Azure Storage
// by Jeff Wilcox. Apache 2 license, have fun with it.

var   azure = require('azure')
    , fs = require('fs');

if (process.argv.length < 3) {
  console.log('Please call with the proper arguments.');
	console.log('node updown.js ACCOUNT KEY CONTAINER up FILENAME');
	console.log('node updown.js ACCOUNT KEY CONTAINER down FILENAME');
}

var filename = process.argv.pop();
var action = process.argv.pop();
var containerName = process.argv.pop();

if (action !== 'up' && action !== 'down') {
	console.log('Invalid action: ' + action);
	return;
}

var blobService = azure.createBlobService();

blobService.createContainerIfNotExists(containerName, function(error){
    if (error) {
    	console.log('Error creating the container:');
       console.dir(error);
       return; 
    }

    var upload = action == 'up';

    if (upload) {
    	if (!fs.existsSync(filename)) {
            console.log('File not found ' + filename);
            return;
    	}
    }

    console.log((upload ? 'Uploading ' : 'Downloading ') + filename + '...');

    var callback = function (error) {
        if (error) {
            console.log('Looks like something went wrong :(');
            console.dir(error);
        } else {
            console.log('OK.');
        }
    }

    blobService[upload ? 'createBlockBlobFromFile' : 'getBlobToFile'](
        containerName, 
        filename,
        filename, 
        callback);
});
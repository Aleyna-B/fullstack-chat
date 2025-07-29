function downloadFile(file) {
        // Create a temporary URL for the file
        const url = URL.createObjectURL(file);

        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name; // Sets the download filename

        // Trigger the download
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function downloadImage(imagePayload) {
        const url = URL.createObjectURL(imagePayload.img);
        const a = document.createElement('a');
        a.href = url;
        a.download = imagePayload.imgName; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    export { downloadFile, downloadImage };
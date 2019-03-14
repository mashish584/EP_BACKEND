const multer = require("multer");
const imagekit = require("imagekit");

// Imagekit Config
const image_kit = new imagekit({
	imagekitId: process.env.IMAGE_KIT_ID,
	apiKey: process.env.IMAGE_KIT_KEY,
	apiSecret: process.env.IMAGE_KIT_SECRET
});

// Multer Storage Config
const storage_ds = multer.diskStorage({
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});

const storage_ms = multer.memoryStorage();

exports.upload_ds = multer({ storage: storage_ds });
exports.upload_ms = multer({ storage: storage_ms });

// Imagekit upload & delete
exports.upload_on_imagekit = async (req, res, next) => {
	const { file } = req;
	if (file) {
		const upload = await image_kit.upload(file.buffer.toString("base64"), {
			filename: "ep.jpg",
			folder: "/ep"
		});
		req.body.imageUrl = upload.url;
		req.body.uploadImg = upload.imagePath;
	}
	next();
};

exports.delete_image_from_imagekit = path => image_kit.deleteFile(path);

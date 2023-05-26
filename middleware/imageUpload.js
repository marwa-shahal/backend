// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "uploads/");
//   },
//   filename: function (req, file, callback) {
//     callback(
//       null,
//       file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
//     );
//   },
// });

// const fileFilter = function (req, file, callback) {
//   const ext = path.extname(file.originalname);
//   if (ext !== ".pdf" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
//     return callback(new Error("Only pdf, jpg, jpeg and png files are allowed"));
//   }
//   callback(null, true);
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

// export default function (req, res, next) {
//   const uploadMiddleware = upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "pdf", maxCount: 1 },
//   ]);
//   uploadMiddleware(req, res, (err) => {
//     console.log(req.body);
//     if (err) {
//       console.error(err);
//       return res.status(400).send({ error: err.message });
//     }
//     console.log("new");
//     const mediaPaths = req.files;
//     req.body.image = mediaPaths["image"] ? mediaPaths["image"][0].path : "";
//     req.body.pdf = mediaPaths["pdf"] ? mediaPaths["pdf"][0].path : "";
//     next();
//   });
// }

import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
});
const upload = multer({ storage });
export default function (req, res, next) {
  if (req.files && req.files.length > 0) {
    upload.single("image")(req, res, (err) => {
      try {
        if (err) {
          return res.status(400).send(err.message);
        }
        console.log(req.body);
        req.body.image = req.file.path;
        next();
      } catch (err) {
        return res.status(400).send({ err: err.message });
      }
    });
  } else {
    // No files were uploaded, skip Multer middleware
    next();
  }
}

import Joi from "joi";
import Jimp from "jimp";
import { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../common/supabase";
import mailgun from "../../common/mailgun";
import certificate from "../../common/templates/certificate";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "ap-south-1",
});
export default async function createCertificate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const schema = Joi.object({
      email: Joi.string().required(),
      eventName: Joi.string().valid("Autogenix", "Mechenzie").required(),
    });
    const { value, error } = schema.validate(req.body);
    if (error) {
      console.log(error);
      throw {
        status: 422,
        message: "Invalid Input",
      };
    } else {
      try {
        const certificateUrl: string =
          "https://s3.ap-south-1.amazonaws.com/org.techanalogy.certificates/Templates/cert-v1.png";
        const { data, error } = await supabase
          .from("certificate-details")
          .select()
          .eq("email", value.email)
          .eq("eventName", value.eventName);
        console.log(data);
        if (error || data.length === 0) {
          console.log("Error");
          console.log(error);
          res.status(404).json({
            message: "Not found",
          });
          return;
        }
        let imageResult;
        const fileName = `${data[0].name.replace(
          /\s/g,
          ""
        )}-${value.eventName.replace(/\s/g, "")}`;
        console.log(fileName);

        const location =
          process.env.HOST + "/open-sans-64-black/open-sans-64-black.fnt";
        console.log(location);
        Jimp.loadFont(location)
          .then((font) => {
            Jimp.read(certificateUrl)
              .then(async (image) => {
                image.print(font, 800, 600, data[0].name);
                await uploadToS3(fileName, image);
                let file =
                  `./public/certificates/${fileName}.` + image.getExtension();
                image.write(file);
              })
              .catch((error) => {
                throw {
                  status: 500,
                  message: "Error while reading image",
                };
              });
          })
          .catch((error) => {
            console.log(error.message);
            throw {
              status: 500,
              message: "Error in loading font",
            };
          });
        const s3Url = `${process.env.S3_URL}${fileName}`;
        await mailgun(
          value.email,
          "Our minions have got a parcel for you",
          certificate(s3Url)
        );
        console.log(s3Url);
        res.status(201).json({
          message: "Get Certificate",
        });
      } catch (e) {
        console.log(e);
        res.status(e.status || 500).json({
          message: e.message || "An unexpected error occurred",
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(e.status || 500).json({
      message: e.message || "An unexpected error occurred",
    });
  }
}

const uploadToS3 = async (name: string, image: any) => {
  const object = await image.getBufferAsync(Jimp.MIME_PNG);
  let params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: name,
    Body: object,
    ContentType: Jimp.MIME_PNG,
    ACL: "public-read",
  };
  try {
    let uploadPromise = await new AWS.S3().putObject(params).promise();
    console.log("Successfully stored in bucket");
  } catch (e) {
    console.log("Error uploading data: ", e);
    throw { message: "Unable to add to bucket", status: 500 };
  }
};

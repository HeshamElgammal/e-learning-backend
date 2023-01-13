const mongoose = require("mongoose");

const { Schema, SchemaTypes } = mongoose;

const homeSchema = new Schema({
  creatorId: { type: SchemaTypes.ObjectId },
  communityName: { type: SchemaTypes.String, unique: true },
  communityDecription: { type: SchemaTypes.String },
  communityCover: { type: SchemaTypes.String },
  communityMembers: { type: SchemaTypes.Array },
  communityCourses: { type: SchemaTypes.Array },
  communityPosts: { type: SchemaTypes.Array },
});

homeSchema.statics.getCommunity = async (_id) => {
  if (_id) {
    let community = await this.findOne({
      _id,
    });
    if (!community) {
      throw Error("Community not found !");
    }
    return community;
  }
};

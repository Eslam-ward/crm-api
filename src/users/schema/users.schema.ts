import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/common/enums/roles.enum';


export type UserDocument = HydratedDocument<User>;


@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;


  @Prop({ required: true, minlength: 6, select: false })
  password: string;
  

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  passwordChangedAt?: Date;

  @Prop()
  passwordResetCode?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop({ default: false })
  passwordResetVerified?: boolean;

  @Prop([{ type: Types.ObjectId, ref: 'Product' }])
  wishlist: Types.ObjectId[];

 @Prop({ select: false })
  refreshToken?: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);

  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }
});
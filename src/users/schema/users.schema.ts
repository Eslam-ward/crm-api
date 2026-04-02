import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/users/enums/roles.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true , index: true })
  email: string;

  @Prop({ required: true, minlength: 6, select: false })
  password: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  passwordChangedAt?: Date;

  @Prop()
  passwordResetCode?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop({ default: false })
  passwordResetVerified?: boolean;

  @Prop({ select: false })
  refreshToken?: string;
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [String], default: [] })
  images: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);

  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }
});

export default interface Mention {
  channel: string;
  user: string;
  message: string;
  color?: string;
  time: Date;
}

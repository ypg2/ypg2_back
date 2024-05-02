export default interface IScheduledLectureDTO {  
  scheduledLectureID?: number;
  weekDayID: number;
  startAt: string;
  endAt: string;
  userID: number;
  lectureID: number;
}

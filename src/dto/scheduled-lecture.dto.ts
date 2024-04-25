export default interface IScheduledLectureDTO {
  selectedLectureID: number;
  scheduledLectureID?: number;
  weekDayID: number;
  startAt: string;
  endAt: string;
}

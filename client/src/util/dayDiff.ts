export default function dayDiff(start: Date, end: Date) {
    return Math.abs(start.getTime() - end.getTime()) / (1000 * 60 * 60 * 24);
}

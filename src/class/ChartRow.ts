export class ChartRow {
    public header: string;
    public timeline: number;
    public value: number;
    public color: string;

    constructor(
        header: string,
        timeline: number,
        value: number,
        color: string
    ) {
        this.header = header;
        this.timeline = timeline;
        this.value = value;
        this.color = color;
    }
}

export abstract class Activity<Props> {
    props: Props

    constructor(props: Props) {
        this.props = props;
    }
}
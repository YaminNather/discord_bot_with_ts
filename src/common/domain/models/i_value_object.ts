export default interface IValueObject<T> {
    fsameValueAs: (other: T)=>boolean;
}
interface IEntity<T> {
  fsameIdentityAs: (other: T)=>boolean;
}

export default IEntity;
class UserInfo {
  name: string;
  bio: string;

  constructor(name: string, bio: string) {
    this.name = name;
    this.bio = bio;
  }

  toObject = () => {
    return { name: this.name, bio: this.bio };
  };
}

export default UserInfo;

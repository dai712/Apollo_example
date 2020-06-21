export default {
  Mutation: {
    createUser: async (_, args) =>{
      console.log(args.nickname!)
      return "success";
    }
  }
}
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = require("graphql");
const axios = require("axios");

// define the type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

// Query for all the apis
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        // the  fetch api is not woking on the node js project
        // we have fetch the data formthe jsonplace holder the the data is fetch from
       return  axios
          .get("http://localhost:3000/users/" + args.id)
          .then((res) => res.data);
      },
    },
  },
});

// mutation query for all the apis
module.exports = new GraphQLSchema({
  query: RootQuery,
});
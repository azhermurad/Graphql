const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
const axios = require("axios");
const res = require("express/lib/response");

// define the type
const CompanyType = new GraphQLObjectType({
  name: "Comapny",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        console.log(parentValue);
        return axios
          .get("http://localhost:3000/company/" + parentValue.id + "/users")
          .then((res) => res.data);
      },
    },
  }),
});

var UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    comapany: {
      type: CompanyType,
      resolve(parentValue, args) {
        console.log(parentValue);
        return axios
          .get("http://localhost:3000/company/" + parentValue.companyId)
          .then((res) => res.data);
      },
    },
  }),
});

// Query for all the apis
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/users/" + args.id)
          .then((res) => res.data);
      },
    },
    comapany: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/company/" + args.id)
          .then((res) => res.data);
      },
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString, defaultValue: null },
      },
      resolve(parentValue, args) {
        return axios
          .post("http://localhost:3000/users", {
            ...args,
          })
          .then((res) => res.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parentValue, args) {
        return (
          axios.delete("http://localhost:3000/users/" + args.id).
          then((res) => {
            console.log(res);
            return res.data;
          })
        );
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type:new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, {id,name,age,companyId}) {
        return (
          axios.patch("http://localhost:3000/users/" + id,{name,age,companyId}).
          then((res) => {
            console.log(res);
            return res.data;
          })
        );
      },
    },
  },
});

// mutation query for all the apis
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

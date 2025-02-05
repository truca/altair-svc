import { gql } from "@apollo/client";

const queriesSelectsField: any = {
  brands: gql`
    query {
      brands(pageSize: -1) {
        list {
          id
          name
        }
      }
    }
  `,
  sellers: gql`
    query {
      sellers(pageSize: -1) {
        list {
          id
          name
        }
      }
    }
  `,
  categories: gql`
    query {
      categories(pageSize: -1) {
        list {
          id
          name
        }
      }
    }
  `,
  subcategories: gql`
    query {
      subcategories(pageSize: -1) {
        list {
          id
          name
        }
      }
    }
  `,
  productManagers: gql`
    query {
      productManagers(pageSize: -1) {
        list {
          externalId
          name
          email
        }
      }
    }
  `,
};

export default queriesSelectsField;

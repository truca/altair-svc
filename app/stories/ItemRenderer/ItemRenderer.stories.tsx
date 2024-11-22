import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card, ThemeProvider, theme } from "@chakra-ui/react";
import { ItemRenderer } from "./index";

const meta: Meta<typeof ItemRenderer> = {
  component: ItemRenderer,
  title: "molecules/ItemRenderer",
};
export default meta;
type Story = StoryObj<typeof ItemRenderer>;

const Wrapper = (Story: any) => (
  <ThemeProvider theme={theme}>
    <Story />
  </ThemeProvider>
);

export const BaseItemRenderer: Story = {
  args: {
    item: {
      name: "John Doe",
      age: 30,
      occupation: "Software Developer",
      location: "San Francisco, CA",
    },
  },
  decorators: [Wrapper],
};

export const CardItem: Story = {
  args: {
    item: {
      name: "John Doe",
      age: 30,
      occupation: "Software Developer",
      location: "San Francisco, CA",
    },
    isCard: true,
  },
  decorators: [Wrapper],
};

export const ComplexData: Story = {
  args: {
    item: {
      title: "Senior Developer",
      company: "Tech Solutions Inc.",
      skills: ["JavaScript", "TypeScript", "React", "Node.js"],
      experience: "8 years",
      projects: [
        { name: "Project A", description: "A major project involving ..." },
        { name: "Project B", description: "Another project that ..." },
      ],
    },
  },
  decorators: [Wrapper],
};

export const NestedObjects: Story = {
  args: {
    item: {
      user: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        address: {
          street: "123 Main St",
          city: "Anytown",
          country: "USA",
        },
      },
      preferences: {
        theme: "dark",
        notifications: true,
      },
    },
  },
  decorators: [Wrapper],
};

export const ArrayOfObjects: Story = {
  args: {
    item: {
      items: [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
      ],
    },
  },
  decorators: [Wrapper],
};

// src/stories/ItemRenderer.stories.tsx

// import React from "react";
// import { ComponentStory, ComponentMeta } from "@storybook/react";
// import { ChakraProvider } from "@chakra-ui/react";

// import ItemRenderer from "./index";

// // Define the metadata for the component
// export default {
//   title: "Components/ItemRenderer",
//   component: ItemRenderer,
//   decorators: [
//     (Story) => (
//       <ChakraProvider>
//         <Story />
//       </ChakraProvider>
//     ),
//   ],
// } as ComponentMeta<typeof ItemRenderer>;

// // Create a template of how args map to rendering
// const Template: ComponentStory<typeof ItemRenderer> = (args) => (
//   <ItemRenderer {...args} />
// );

// // Define the default story
// export const Default = Template.bind({});
// Default.args = {
//   item: {
//     name: "John Doe",
//     age: 30,
//     occupation: "Software Developer",
//     location: "San Francisco, CA",
//   },
// };

// // Define a story with more complex data
// export const ComplexData = Template.bind({});
// ComplexData.args = {
//   item: {
//     title: "Senior Developer",
//     company: "Tech Solutions Inc.",
//     skills: ["JavaScript", "TypeScript", "React", "Node.js"],
//     experience: "8 years",
//     projects: [
//       { name: "Project A", description: "A major project involving ..." },
//       { name: "Project B", description: "Another project that ..." },
//     ],
//   },
// };

// // Define a story with nested objects
// export const NestedObject = Template.bind({});
// NestedObject.args = {
//   item: {
//     user: {
//       name: "Jane Smith",
//       email: "jane.smith@example.com",
//       address: {
//         street: "123 Main St",
//         city: "Anytown",
//         country: "USA",
//       },
//     },
//     preferences: {
//       theme: "dark",
//       notifications: true,
//     },
//   },
// };

// // Define a story with an array of simple objects
// export const ArrayOfObjects = Template.bind({});
// ArrayOfObjects.args = {
//   item: {
//     items: [
//       { id: 1, name: "Item 1" },
//       { id: 2, name: "Item 2" },
//       { id: 3, name: "Item 3" },
//     ],
//   },
// };

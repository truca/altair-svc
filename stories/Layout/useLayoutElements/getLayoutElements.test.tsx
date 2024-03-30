import { getLayoutElements } from "./index";

import { Grid, GridItem } from "@chakra-ui/react";

describe("getLayoutElements", () => {
  it("should return an empty array when receiving an empty array", () => {
    const result = getLayoutElements([], []);
    expect(result).toEqual([]);
  });
  it("should return an item when receiving an item", () => {
    const result = getLayoutElements({ type: "item", area: "element" }, [
      <GridItem area="element">Element</GridItem>,
    ]);
    expect(result).toEqual(<GridItem area="element">Element</GridItem>);
  });
  it("should return an grid with props when receiving a grid with props", () => {
    const result = getLayoutElements(
      {
        type: "grid",
        area: "element",
        props: { style: { display: "inline-block" } },
      },
      []
    );
    expect(result).toMatchObject(
      <Grid area="element" style={{ display: "inline-block" }} />
    );
  });
  it("should return multiple items when receiving an array of items", () => {
    const result = getLayoutElements(
      [
        { type: "item", area: "B" },
        { type: "item", area: "A" },
      ],
      [<GridItem area="A">A</GridItem>, <GridItem area="B">B</GridItem>]
    );
    expect(result).toEqual([
      <GridItem area="B">B</GridItem>,
      <GridItem area="A">A</GridItem>,
    ]);
  });
  it("should return grid with children", () => {
    const result = getLayoutElements(
      {
        type: "grid",
        items: [
          { type: "item", area: "B" },
          { type: "item", area: "A" },
        ],
      },
      [<GridItem area="A">A</GridItem>, <GridItem area="B">B</GridItem>]
    );
    expect(result).toMatchObject(
      <Grid>
        <GridItem area="B">B</GridItem>
        <GridItem area="A">A</GridItem>
      </Grid>
    );
  });
});

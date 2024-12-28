import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Select, Card, Button, VStack, HStack } from "@chakra-ui/react";
import { Option } from "@/app/types";
import { capitalizeFirstLetter } from "@/app/utils";
import { FaIcon } from "../Text/FaIcon";
import { UseFormGetValues } from "react-hook-form";
// import SmartList from "../SmartList";
import { smartListCtx } from "@/app/constants";
import { SectionsHash } from "@/app/components";

type Faction = "chaos" | "corruption" | "wild" | "order" | "fortitude";

const FACTIONS = ["chaos", "corruption", "wild", "order", "fortitude"];

const WHEEL_OF_FORCES: { [key in Faction]: Faction[] } = {
  chaos: ["fortitude", "corruption"],
  corruption: ["chaos", "wild"],
  wild: ["corruption", "order"],
  order: ["wild", "fortitude"],
  fortitude: ["order", "chaos"],
};

const CAMPAIGN_UPGRADES = [
  "Armory",
  "Training Halls",
  "Temple",
  "Mercenary Outpost",
];

interface TagsWithTimes {
  tags?: string[];
  times?: number;
}

function getAllowedTagsAndTimesFromSelectedGuildUpgrades(
  selectedValues: string[],
  allOptions: OptionWithBase[]
): TagsWithTimes[] {
  return selectedValues.reduce((acc, value) => {
    const option = allOptions.find((option) => option.value === value);
    if (!option) {
      return acc;
    }
    // if there's an element already in the array with the exact same tags and has times, increment the times
    const hasAllowsTagsMax = Boolean(option.base.allowsTagsMax);
    const existingElement = acc.find(
      (element) =>
        element.times &&
        JSON.stringify(element.tags) === JSON.stringify(option.base.allowsTags)
    );
    if (hasAllowsTagsMax && existingElement) {
      existingElement.times = existingElement.times
        ? existingElement.times + (option.base.allowsTagsMax as number)
        : existingElement.times;

      return acc;
    }
    return acc.concat([
      { tags: option.base.allowsTags, times: option.base.allowsTagsMax },
    ]);
  }, [] as TagsWithTimes[]);
}

interface GuildUpgrade {
  name: string;
  isUnique?: boolean;
  allowsTags?: string[];
  allowsTagsMax?: number;
  description?: string;
  options?: GuildUpgradeOption[];
  cost: number;
  image?: string;
  isExclusiveToCampaigns?: boolean;
}

interface GuildUpgradeOption {
  name: string;
  allowsTags: string[];
  allowsTagsMax: number;
  description: string;
  cost: number;
}

type OptionWithBase = Option<string> & { base: GuildUpgrade; parent?: string };

export interface UnitSelectProps {
  defaultValue: string[];
  options: OptionWithBase[];
  value: string[];
  onChange: (values: string[]) => void;
  getValues: UseFormGetValues<any>;
}

// TODO: Add a way to handle unique accross options
// TODO: Filter diplomatic deals by faction
function UnitSelect({
  value,
  defaultValue,
  options: baseOptions,
  onChange: onChangeProp,
  getValues,
}: UnitSelectProps) {
  const [selectedValues, setSelectedValues] = useState(
    value || defaultValue || []
  );
  const [selectKey, setSelectKey] = useState(1);

  const values = useMemo(() => {
    return getValues();
  }, [getValues]);

  const allOptions: OptionWithBase[] = useMemo(() => {
    return baseOptions.reduce((acc, option) => {
      const options = Array.isArray(option.base.options)
        ? option.base.options.map((childOption) => ({
            ...option,
            ...childOption,
            base: { ...option.base, ...childOption },
            label: `${childOption.name} (${
              childOption.cost ? childOption.cost : option.base.cost
            })`,
            parent: option.base.name,
            value: childOption.name,
          }))
        : undefined;
      return [
        ...acc,
        ...(options
          ? options
          : [
              {
                ...option,
                label: `${option.base.name} (${option.base.cost})`,
                value: option.base.name,
              },
            ]),
      ];
    }, [] as OptionWithBase[]);
  }, [baseOptions]);

  const selectedOptions = useMemo(() => {
    return selectedValues
      .map((value) => {
        return allOptions.find((option) => option.value === value);
      })
      .filter((v) => !!v) as OptionWithBase[];
  }, [selectedValues, allOptions]);

  const usedGloryPoints = useMemo(() => {
    return selectedOptions.reduce(
      (acc, option) => acc + (option?.base.cost || 0),
      0
    );
  }, [selectedOptions]);

  const maxGloryPoints = values.glory_points || 0;
  const hasReachedLimit = usedGloryPoints >= maxGloryPoints;
  const availableGuildUpgrades = maxGloryPoints - usedGloryPoints;

  const options: Option<string>[] = useMemo(() => {
    const faction = values.faction;
    const selectedParentOptions = selectedOptions
      .map((o) => o.parent)
      .filter(Boolean);
    return (
      allOptions
        // filter non-campaign upgrades if guild is non campaign
        .filter((option) => {
          const isCampaignUpgrade = CAMPAIGN_UPGRADES.includes(
            option.base.name
          );
          return values.isCampaign ? true : !isCampaignUpgrade;
        })
        // filter diplomatic deals not available to the faction
        .filter((option) => {
          const isFactionOption = option.base.allowsTags?.some((tag) =>
            FACTIONS.includes(tag)
          );
          if (!isFactionOption) return true;
          const allowedFactions = WHEEL_OF_FORCES[faction as Faction];
          return allowedFactions.includes(
            option.base.allowsTags?.[0] as Faction
          );
        })
        .filter((option) => {
          const shouldKeepNormalOption =
            selectedValues.includes(option.value) && option.base.isUnique;
          const shouldKeepOptionWithChildren =
            option.base.isUnique &&
            selectedParentOptions.includes(option.parent);
          return !shouldKeepNormalOption && !shouldKeepOptionWithChildren;
        })
        .filter((option) => {
          return option.base.cost <= availableGuildUpgrades;
        })
    );
  }, [selectedValues, allOptions, availableGuildUpgrades, values]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedValues((values) => {
        const newValue = [...values, e.target.value];
        onChangeProp(newValue);
        return newValue;
      });
      setSelectKey((key) => key + 1);
    },
    [onChangeProp, setSelectKey]
  );

  const onRemove = useCallback(
    (value: string) => {
      setSelectedValues((values) => values.filter((v) => v !== value));
    },
    [setSelectedValues]
  );

  const allowedTags = getAllowedTagsAndTimesFromSelectedGuildUpgrades(
    values.guild_upgrades,
    allOptions
  );
  console.log({ values });

  const SmartList = SectionsHash["SmartList"];

  return (
    <VStack spacing={5}>
      <Card style={{ alignSelf: "flex-end", padding: 8 }} variant="elevated">
        Used: {usedGloryPoints} / {maxGloryPoints}
      </Card>
      <SmartList
        // SUPER specific to this context
        {...smartListCtx}
        containerSx={{
          ...smartListCtx.containerSx,
          margin: 0,
          overflow: "scroll",
          height: "calc(100vh - 280px)",
        }}
        itemProps={{ showAmountControls: true, showHeart: false }}
        where={{}}
      />
    </VStack>
  );
}

export default UnitSelect;

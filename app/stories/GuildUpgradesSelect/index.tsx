import React, { useCallback, useMemo, useState } from "react";
import { Select, Card, Button, VStack, HStack } from "@chakra-ui/react";
import { Option } from "@/app/types";
import { capitalizeFirstLetter } from "@/app/utils";
import { FaIcon } from "../Text/FaIcon";
import { UseFormGetValues } from "react-hook-form";

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

// value format: guildUpgrade:cost:tags:amount
// example: "Elemental Arcanum III:3:elemental 1,elemental 2,elemental 3:1"

export interface GuildUpgradesSelectProps {
  defaultValue: string[];
  options: OptionWithBase[];
  value: string[];
  onChange: (values: string[]) => void;
  getValues: UseFormGetValues<any>;
}

interface SelectedGuildUpgrade {
  name: string;
  cost: number;
  tags: string[];
  amount: number;
}

function getSelectedGuildUpgradesFromDefaultValue(
  defaultValue: string[]
): SelectedGuildUpgrade[] {
  if (!defaultValue) {
    return [];
  }
  return defaultValue.map((value) => {
    const [name, cost, tags, amount] = value.split(":");
    return {
      name,
      cost: parseInt(cost),
      tags: tags?.includes(",") ? tags.split(",") : [tags],
      amount: parseInt(amount),
    };
  });
}

function getDefaultValueFromSelectedGuildUpgrades(
  selectedGuildUpgrades: SelectedGuildUpgrade[]
): string[] {
  if (!selectedGuildUpgrades) {
    return [];
  }
  return selectedGuildUpgrades.map((guildUpgrade) => {
    return `${guildUpgrade.name}:${guildUpgrade.cost}:${
      Array.isArray(guildUpgrade?.tags) ? guildUpgrade?.tags.join(",") : ""
    }:${guildUpgrade.amount}`;
  });
}

function GuildUpgradesSelect({
  value,
  defaultValue,
  options: baseOptions,
  onChange: onChangeProp,
  getValues,
}: GuildUpgradesSelectProps) {
  const formSelectedGuildUpgrades = useMemo(() => {
    return getSelectedGuildUpgradesFromDefaultValue(value);
  }, [value]);
  const defaultSelectedGuildUpgrades = useMemo(() => {
    return getSelectedGuildUpgradesFromDefaultValue(defaultValue);
  }, [defaultValue]);
  const [selectedGuildUpgrades, setSelectedGuildUpgrades] = useState<
    SelectedGuildUpgrade[]
  >(formSelectedGuildUpgrades || defaultSelectedGuildUpgrades || []);
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
    return selectedGuildUpgrades
      .map((selectedGuildUpgrade) => {
        const option = allOptions.find(
          (option) => option.value === selectedGuildUpgrade.name
        );
        if (
          !selectedGuildUpgrade?.amount ||
          selectedGuildUpgrade?.amount < 0 ||
          !option
        )
          return null;
        return new Array(selectedGuildUpgrade.amount).fill(option);
      })
      .filter(Boolean)
      .flat()
      .filter((v) => !!v) as OptionWithBase[];
  }, [selectedGuildUpgrades, allOptions]);

  const usedGuildUpgradePoints = useMemo(() => {
    return selectedOptions.reduce(
      (acc, option) => acc + (option?.base.cost || 0),
      0
    );
  }, [selectedOptions]);

  const maxGuildUpgrades = values.guild_upgrade_points || 0;
  const hasReachedLimit = usedGuildUpgradePoints >= maxGuildUpgrades;
  const availableGuildUpgrades = maxGuildUpgrades - usedGuildUpgradePoints;

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
            selectedGuildUpgrades
              .map((sgu) => sgu.name)
              .includes(option.value) && option.base.isUnique;
          const shouldKeepOptionWithChildren =
            option.base.isUnique &&
            selectedParentOptions.includes(option.parent);
          return !shouldKeepNormalOption && !shouldKeepOptionWithChildren;
        })
        .filter((option) => {
          return option.base.cost <= availableGuildUpgrades;
        })
    );
  }, [selectedGuildUpgrades, allOptions, availableGuildUpgrades, values]);

  const onAdd = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedGuildUpgrades((sgus: any) => {
        const name = e.target.value;
        const isElementAlreadySelected = sgus.find(
          (sgu: SelectedGuildUpgrade) => sgu.name === name
        );
        if (isElementAlreadySelected) {
          const newGUs = sgus.map((sgu: SelectedGuildUpgrade) => {
            if (sgu.name === name) {
              return {
                ...sgu,
                amount: sgu.amount + 1,
              };
            }
            return sgu;
          });
          onChangeProp(
            getDefaultValueFromSelectedGuildUpgrades(
              newGUs as SelectedGuildUpgrade[]
            )
          );

          return newGUs;
        }
        const guildUpgrade = allOptions.find((option) => option.value === name);
        const newValue: SelectedGuildUpgrade[] = [
          ...sgus,
          {
            name: guildUpgrade?.value,
            cost: guildUpgrade?.base.cost,
            tags: guildUpgrade?.base.allowsTags,
            amount: 1,
          },
        ];
        onChangeProp(
          getDefaultValueFromSelectedGuildUpgrades(
            newValue as SelectedGuildUpgrade[]
          )
        );
        return newValue;
      });
      setSelectKey((key) => key + 1);
    },
    [onChangeProp, setSelectKey]
  );

  const onRemove = useCallback(
    (name: string) => {
      setSelectedGuildUpgrades((prevGUs) => {
        const selectedElement = prevGUs.find(
          (value: SelectedGuildUpgrade) => value.name === name
        );
        if (!selectedElement) {
          return prevGUs;
        }
        if (selectedElement.amount === 1) {
          const newGUs = prevGUs.filter(
            (value: SelectedGuildUpgrade) => value.name !== name
          );
          onChangeProp(
            getDefaultValueFromSelectedGuildUpgrades(
              newGUs as SelectedGuildUpgrade[]
            )
          );
          return newGUs;
        }
        const newGUs = prevGUs.map((value: SelectedGuildUpgrade) =>
          value.name === name ? { ...value, amount: value.amount - 1 } : value
        );
        onChangeProp(
          getDefaultValueFromSelectedGuildUpgrades(
            newGUs as SelectedGuildUpgrade[]
          )
        );
        return newGUs;
      });
    },
    [setSelectedGuildUpgrades]
  );

  const allowedTags = getAllowedTagsAndTimesFromSelectedGuildUpgrades(
    selectedGuildUpgrades.map((sgu) => sgu.name),
    allOptions
  );
  console.log({ allowedTags, value });

  return (
    <VStack spacing={5}>
      <Card style={{ alignSelf: "flex-end", padding: 8 }} variant="elevated">
        Used: {usedGuildUpgradePoints} / {maxGuildUpgrades}
      </Card>
      {selectedOptions.map((option) => (
        <Card
          key={option.value}
          style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          variant="elevated"
        >
          <VStack style={{ position: "relative" }}>
            <div>Name: {option.base.name}</div>
            <div>Description: {option.base.description}</div>
            {option.base.cost && <div>Cost: {option.base.cost}</div>}
            {option.base.allowsTags && (
              <div>
                Allows Tags:{" "}
                {option.base.allowsTags
                  ?.map((tag) => capitalizeFirstLetter(tag))
                  .join(", ")}
              </div>
            )}
            {option.base.name !== "Guildhall" && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  cursor: "pointer",
                }}
                onClick={() => onRemove(option.value)}
              >
                <FaIcon icon="FaXmark" />
              </div>
            )}
          </VStack>
        </Card>
      ))}
      {!hasReachedLimit && (
        <Card
          style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          variant="elevated"
        >
          <label>Select upgrade</label>
          <Select key={selectKey} onChange={onAdd} placeholder="Select upgrade">
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Card>
      )}
    </VStack>
  );
}

export default GuildUpgradesSelect;

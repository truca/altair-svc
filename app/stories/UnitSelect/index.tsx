import React, { useCallback, useMemo, useState } from "react";
import { Card, VStack } from "@chakra-ui/react";
import { UseFormGetValues } from "react-hook-form";
import { baseUrl, smartListCtx } from "@/app/constants";
import { SectionsHash } from "@/app/components";

interface TagsWithTimes {
  tags?: string[];
  times?: number;
}

// selectedGuildUpgrade format: name:cost:tags:amount
function getTagsAndTimesFromSelectedGuildUpgrades(
  selectedGuildUpgrades: string[]
): TagsWithTimes[] {
  if (!selectedGuildUpgrades) {
    return [];
  }
  return selectedGuildUpgrades.reduce((acc, value) => {
    const [_, __, tags, amount] = value.split(":");
    if (!tags) return acc;
    const tagsArr = tags.includes(",") ? tags.split(",") : [tags];

    // if tag already exists, increment the times
    const existingElement = acc.find(
      (element) => JSON.stringify(element.tags) === JSON.stringify(tagsArr)
    );
    if (existingElement) {
      existingElement.times = existingElement.times
        ? existingElement.times + parseInt(amount)
        : parseInt(amount);
      return acc;
    }

    return acc.concat([{ tags: tagsArr, times: parseInt(amount) }]);
  }, [] as TagsWithTimes[]);
}

interface SelectedUnit {
  id: string;
  cost: number;
  amount: number;
}

export interface UnitSelectProps {
  value: string[];
  defaultValue: string[];
  onChange: (values: string[]) => void;
  getValues: UseFormGetValues<any>;
}

const getSelectedUnitsFromDefaultValue = (defaultValue: string[]) => {
  if (!defaultValue) {
    return [];
  }
  return defaultValue.map((value) => {
    const [id, cost, amount] = value.split(":");
    return {
      id,
      cost: parseInt(cost),
      amount: parseInt(amount),
    };
  });
};

const getDefaultValueFromSelectedUnits = (selectedUnits: SelectedUnit[]) => {
  if (!selectedUnits) {
    return [];
  }
  return selectedUnits.map((unit) => {
    return `${unit.id}:${unit.cost}:${unit.amount}`;
  });
};

function UnitSelect({
  value,
  defaultValue,
  onChange: onChangeProp,
  getValues,
}: UnitSelectProps) {
  const formSelectedUnits = useMemo(() => {
    return getSelectedUnitsFromDefaultValue(value);
  }, [value]);

  const defaultSelectedUnits = useMemo(() => {
    return getSelectedUnitsFromDefaultValue(defaultValue);
  }, [defaultValue]);

  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>(
    formSelectedUnits || defaultSelectedUnits || []
  );
  console.log({ selectedUnits });

  const values = useMemo(() => {
    return getValues();
  }, [getValues]);

  const usedGloryPoints = useMemo(() => {
    return selectedUnits.reduce(
      (acc, unit) => acc + unit.cost * unit.amount,
      0
    );
  }, [selectedUnits]);

  const maxGloryPoints = values.glory_points || 0;
  // const hasReachedLimit = usedGloryPoints >= maxGloryPoints;
  // const availableGuildUpgrades = maxGloryPoints - usedGloryPoints;

  const tagsWithTimes = getTagsAndTimesFromSelectedGuildUpgrades(
    values.guild_upgrades
  );
  const faction = values.faction;
  const baseTags = [...tagsWithTimes.map((t) => t.tags).flat()];
  const baseTagsMapped = baseTags.map((tag) =>
    tag === "hero" ? `hero,${faction}` : tag
  );
  const tagsFilter = [...baseTagsMapped, faction];
  console.log({ values, tagsWithTimes, faction });

  const onIncrease = useCallback(
    (id: string, cost: number) => {
      setSelectedUnits((prev) => {
        const unit = prev.find((unit) => unit.id === id);
        if (!unit) {
          const newSelectedUnits = prev.concat([
            {
              id,
              cost,
              amount: 1,
            },
          ]);
          onChangeProp(getDefaultValueFromSelectedUnits(newSelectedUnits));
          return newSelectedUnits;
        }
        const newSelectedUnits = prev.map((unit) =>
          unit.id === id ? { ...unit, amount: unit.amount + 1 } : unit
        );
        onChangeProp(getDefaultValueFromSelectedUnits(newSelectedUnits));
        return newSelectedUnits;
      });
    },
    [selectedUnits, setSelectedUnits]
  );

  const onDecrease = useCallback(
    (id: string) => {
      setSelectedUnits((prev) => {
        const unit = prev.find((unit) => unit.id === id);

        if (!unit) {
          return prev;
        }
        if (unit.amount === 1) {
          const newSelectedUnits = prev.filter((unit) => unit.id !== id);
          onChangeProp(getDefaultValueFromSelectedUnits(newSelectedUnits));
          return newSelectedUnits;
        }
        const newSelectedUnits = prev.map((unit) =>
          unit.id === id ? { ...unit, amount: unit.amount - 1 } : unit
        );
        onChangeProp(getDefaultValueFromSelectedUnits(newSelectedUnits));
        return prev.map((unit) =>
          unit.id === id ? { ...unit, amount: unit.amount - 1 } : unit
        );
      });
    },
    [selectedUnits, setSelectedUnits]
  );

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
        itemMap={(option: any) => ({
          ...option,
          image: baseUrl + "/" + option.image,
          amount: selectedUnits.find((unit) => unit.id === option.id)?.amount,
        })}
        itemProps={{
          showAmountControls: true,
          showHeart: false,
          onIncrease,
          onDecrease,
        }}
        where={{
          tags: tagsFilter,
        }}
      />
    </VStack>
  );
}

export default UnitSelect;

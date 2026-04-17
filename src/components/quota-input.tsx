"use client";

import { useMemo, useState } from "react";

import { SelectInput, TextInput } from "@/components/ui";

const MULTIPLIERS = {
  MB: 1024 ** 2,
  GB: 1024 ** 3,
} as const;

type Unit = keyof typeof MULTIPLIERS;

export function QuotaInput({
  name,
  id,
}: {
  name: string;
  id: string;
}) {
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<Unit>("GB");

  const bytesValue = useMemo(() => {
    const numeric = Number.parseFloat(amount);

    if (!Number.isFinite(numeric) || numeric <= 0) {
      return "";
    }

    return String(Math.round(numeric * MULTIPLIERS[unit]));
  }, [amount, unit]);

  return (
    <>
      <input type="hidden" name={name} value={bytesValue} />
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
        <TextInput
          id={id}
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          placeholder="1"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <SelectInput value={unit} onChange={(event) => setUnit(event.target.value as Unit)}>
          <option value="MB">MB</option>
          <option value="GB">GB</option>
        </SelectInput>
      </div>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";

import { SelectInput, TextInput } from "@/components/ui";

const MULTIPLIERS = {
  MB: 1024 ** 2,
  GB: 1024 ** 3,
} as const;

type Unit = keyof typeof MULTIPLIERS;

function deriveInitialState(initialBytes: bigint | null | undefined) {
  if (!initialBytes || initialBytes <= BigInt(0)) {
    return { amount: "", unit: "GB" as Unit };
  }

  const gigabytes = BigInt(MULTIPLIERS.GB);

  if (initialBytes % gigabytes === BigInt(0)) {
    return { amount: String(initialBytes / gigabytes), unit: "GB" as Unit };
  }

  return {
    amount: (Number(initialBytes) / MULTIPLIERS.MB).toString(),
    unit: "MB" as Unit,
  };
}

export function QuotaInput({
  name,
  id,
  initialBytes,
}: {
  name: string;
  id: string;
  initialBytes?: bigint | null;
}) {
  const initialState = useMemo(() => deriveInitialState(initialBytes), [initialBytes]);
  const [amount, setAmount] = useState(initialState.amount);
  const [unit, setUnit] = useState<Unit>(initialState.unit);

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
          step="0.01"
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

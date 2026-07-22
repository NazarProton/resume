'use client';

import { useState } from 'react';

type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
type JsonObject = { [key: string]: JsonValue };

type Props = {
  value: JsonValue;
  onChange: (value: JsonValue) => void;
  pathLabel?: string;
};

function primitiveType(value: JsonValue) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function defaultByType(type: string): JsonValue {
  if (type === 'string') return '';
  if (type === 'number') return 0;
  if (type === 'boolean') return false;
  if (type === 'array') return [];
  if (type === 'object') return {};
  return null;
}

function JsonEditor({ value, onChange, pathLabel = 'root' }: Props) {
  const valueType = primitiveType(value);
  const [newKey, setNewKey] = useState('');
  const [newType, setNewType] = useState('string');

  if (valueType === 'string') {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded border border-gray-300 px-2 py-1 text-xs">pen</span>
        <input
          className="w-full rounded border border-gray-300 p-2 text-sm"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (valueType === 'number') {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded border border-gray-300 px-2 py-1 text-xs">pen</span>
        <input
          className="w-full rounded border border-gray-300 p-2 text-sm"
          type="number"
          value={value as number}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    );
  }

  if (valueType === 'boolean') {
    return (
      <label className="inline-flex items-center gap-2 text-sm">
        <span className="rounded border border-gray-300 px-2 py-1 text-xs">pen</span>
        <input
          type="checkbox"
          checked={value as boolean}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{(value as boolean) ? 'true' : 'false'}</span>
      </label>
    );
  }

  if (valueType === 'null') {
    return <div className="text-sm text-gray-500">null</div>;
  }

  if (valueType === 'array') {
    const items = value as JsonValue[];
    return (
      <div className="rounded border border-gray-200 p-3">
        <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
          {pathLabel} (array)
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="rounded border border-gray-200 p-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">[{index}]</span>
                <div className="flex items-center gap-2">
                  <span className="rounded border border-gray-300 px-2 py-1 text-xs">pen</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = items.filter((_, i) => i !== index);
                      onChange(next);
                    }}
                    className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <JsonEditor
                value={item}
                onChange={(nextItem) => {
                  const next = [...items];
                  next[index] = nextItem;
                  onChange(next);
                }}
                pathLabel={`${pathLabel}[${index}]`}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            className="rounded border border-gray-300 p-2 text-xs"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
          >
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="boolean">boolean</option>
            <option value="object">object</option>
            <option value="array">array</option>
            <option value="null">null</option>
          </select>
          <button
            type="button"
            onClick={() => onChange([...items, defaultByType(newType)])}
            className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
          >
            + Add item
          </button>
        </div>
      </div>
    );
  }

  const entries = Object.entries(value as JsonObject);
  return (
    <div className="rounded border border-gray-200 p-3">
      <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
        {pathLabel} (object)
      </div>
      <div className="space-y-3">
        {entries.map(([key, fieldValue]) => (
          <ObjectField
            key={key}
            fieldKey={key}
            fieldValue={fieldValue}
            parent={value as JsonObject}
            onChange={onChange}
            pathLabel={pathLabel}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          className="rounded border border-gray-300 p-2 text-xs"
          placeholder="new key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        <select
          className="rounded border border-gray-300 p-2 text-xs"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        >
          <option value="string">string</option>
          <option value="number">number</option>
          <option value="boolean">boolean</option>
          <option value="object">object</option>
          <option value="array">array</option>
          <option value="null">null</option>
        </select>
        <button
          type="button"
          onClick={() => {
            if (!newKey.trim()) return;
            if (newKey in (value as JsonObject)) return;
            onChange({
              ...(value as JsonObject),
              [newKey.trim()]: defaultByType(newType),
            });
            setNewKey('');
          }}
          className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
        >
          + Add field
        </button>
      </div>
    </div>
  );
}

type ObjectFieldProps = {
  fieldKey: string;
  fieldValue: JsonValue;
  parent: JsonObject;
  onChange: (value: JsonValue) => void;
  pathLabel: string;
};

function ObjectField({
  fieldKey,
  fieldValue,
  parent,
  onChange,
  pathLabel,
}: ObjectFieldProps) {
  const [nextKey, setNextKey] = useState(fieldKey);

  return (
    <div className="rounded border border-gray-200 p-2">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded border border-gray-300 px-2 py-1 text-xs">pen</span>
        <input
          className="rounded border border-gray-300 px-2 py-1 text-xs"
          value={nextKey}
          onChange={(e) => setNextKey(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            const trimmed = nextKey.trim();
            if (!trimmed || trimmed === fieldKey || trimmed in parent) return;
            const { [fieldKey]: oldValue, ...rest } = parent;
            onChange({
              ...rest,
              [trimmed]: oldValue,
            });
          }}
          className="rounded bg-amber-500 px-2 py-1 text-xs font-semibold text-white"
        >
          Rename
        </button>
        <button
          type="button"
          onClick={() => {
            const rest = { ...parent };
            delete rest[fieldKey];
            onChange(rest);
          }}
          className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white"
        >
          Delete
        </button>
      </div>
      <JsonEditor
        value={fieldValue}
        onChange={(nextValue) =>
          onChange({
            ...parent,
            [fieldKey]: nextValue,
          })
        }
        pathLabel={`${pathLabel}.${fieldKey}`}
      />
    </div>
  );
}

export default JsonEditor;

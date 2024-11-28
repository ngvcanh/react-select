"use client";

import { Card } from "@/components/app/card";
import { Section } from "@/components/app/section";
import { Select } from "@/components/app/select";

const allOptions = [
  { value: 1, label: "Apple" },
  { value: 2, label: "Banana" },
  { value: 3, label: "Orange" },
  { value: "fruits", label: "Fruits", group: true },
  { value: 4, label: "Mango" },
  { value: 5, label: "Grape" },
  { value: 6, label: "Watermelon" },
  { value: "vegetables", label: "Vegetables", group: true },
  { value: 7, label: "Carrot" },
  { value: 8, label: "Broccoli" }, 
  { value: 9, label: "Cucumber" },
  { value: "meat", label: "Meat", group: true },
  { value: 10, label: "Beef" },
  { value: 11, label: "Pork" },
  { value: 12, label: "Chicken" },
  { value: "seafood", label: "Seafood", group: true },
  { value: 13, label: "Fish" },
  { value: 14, label: "Shrimp" },
  { value: 15, label: "Crab" },
  { value: "dairy", label: "Dairy Products", group: true },
  { value: 16, label: "Milk" },
  { value: 17, label: "Cheese" },
  { value: 18, label: "Yogurt" },
  { value: "grains", label: "Grains", group: true },
  { value: 19, label: "Rice" },
  { value: 20, label: "Wheat" },
  { value: 21, label: "Oats" },
  { value: "beverages", label: "Beverages", group: true },
  { value: 22, label: "Coffee" },
  { value: 23, label: "Tea" },
  { value: 24, label: "Juice" },
  { value: "snacks", label: "Snacks", group: true },
  { value: 25, label: "Chips" },
  { value: 26, label: "Nuts" },
  { value: 27, label: "Cookies" },
  { value: "condiments", label: "Condiments", group: true },
  { value: 28, label: "Salt" },
  { value: 29, label: "Pepper" },
  { value: 30, label: "Sugar" },
  { value: "herbs", label: "Herbs & Spices", group: true },
  { value: 31, label: "Basil" },
  { value: 32, label: "Thyme" },
  { value: 33, label: "Oregano" },
  ...Array.from({ length: 100 }, (_, i) => ({
    value: i + 34,
    label: `Item ${i + 34}`
  }))
];

const options = allOptions.slice(0, 25);

const otherOptions = options.map((option) => {
  const { value, label, ...rest } = option;
  return { ...rest, id: value, name: label };
})

export default function Home() {
  return (
    <div className="w-full min-h-screen p-10">
      <Section title="Single">
        <Card title="Normally">
          <Select options={options} />
        </Card>
        <Card title="Normally with placeholer">
          <Select options={options} placeholder="Select option" />
        </Card>
        <Card title="Normally [showCheckbox=true]">
          <Select
            options={options}
            placeholder="Select option"
            showCheckbox
          />
        </Card>
        <Card title="Normally [separator=true]">
          <Select options={options} separator />
        </Card>
      </Section>
      <Section title="Multiple">
      <Card title="Multiple [keepOnSelect=true|default]">
          <Select
            options={options}
            multiple
            placeholder="Select option"
          />
        </Card>
        <Card title="Multiple [keepOnSelect=false]">
          <Select
            options={options}
            multiple
            keepOnSelect={false}
            placeholder="Select option"
          />
        </Card>
        <Card title="Multiple [maxSelect=3]">
          <Select
            options={options}
            multiple
            maxSelect={3}
            placeholder="Select option"
          />
        </Card>
        <Card title="Multiple [displayCount=3]">
          <Select
            options={options}
            multiple
            displayCount={3}
            placeholder="Select option"
          />
        </Card>
        <Card title="Multiple [truncate=true]">
          <Select
            options={options}
            multiple
            truncate
            placeholder="Select option"
          />
        </Card>
        <Card title="Multiple [chip=true]">
          <Select
            options={options}
            multiple
            chip
            placeholder="Select option"
          />
        </Card>
        <Card title="Multiple [chip=true][truncate=true]">
          <Select
            options={options}
            multiple
            chip
            truncate
            placeholder="Select option"
          />
        </Card>
        <Card title="Multiple [chip=true][displayCount=3]">
          <Select
            options={options}
            multiple
            chip
            displayCount={3}
            placeholder="Select option"
          />
        </Card>
        <Card title="Multiple [chip=true][displayCount=3][showCheckbox=true]">
          <Select
            options={options}
            multiple
            chip
            showCheckbox
            displayCount={3}
            placeholder="Select option"
          />
        </Card>
        <Card title="Multiple [chip=true][removable=false]">
          <Select
            options={options}
            multiple
            chip
            removable={false}
            placeholder="Select option"
          />
        </Card>
      </Section>
      <Section title="Searchable">
        <Card title='Single [searchPosition="anchor"|default]'>
          <Select
            options={options}
            searchable
            placeholder="Search..."
          />
        </Card>
        <Card title='Single [searchPosition="dropdown"]'>
          <Select
            options={options}
            searchable
            searchPosition="dropdown"
            placeholder="Search..."
          />
        </Card>
        <Card title='Multiple [searchPosition="anchor"|default]'>
          <Select
            options={options}
            searchable
            multiple
            placeholder="Search..."
          />
        </Card>
        <Card title='Multiple [searchPosition="dropdown"|]'>
          <Select
            options={options}
            searchable
            multiple
            searchPosition="dropdown"
            placeholder="Search..."
          />
        </Card>
      </Section>
      <Section title="Responsive">
        <Card title="Modal mobile [asModal=true]">
          <Select
            options={options}
            placeholder="Select option"
            asModal
          />
        </Card>
        <Card title="Modal mobile [asModal=true][breakpoint=500]">
          <Select
            options={options}
            placeholder="Select option"
            breakpoint={500}
            asModal
          />
        </Card>
      </Section>
      <Section title="Group">
        <Card title="Custom [getOptionValue][getOptionLabel]">
          <Select
            options={otherOptions}
            placeholder="Select option"
            asModal
            getOptionValue={(item) => item.id as string}
            getOptionLabel={(item) => item.name as string}
          />
        </Card>
        <Card title="Custom [splitColumns=true]">
          <Select
            options={options}
            placeholder="Select option"
            splitColumns
          />
        </Card>
      </Section>
    </div>
  );
}

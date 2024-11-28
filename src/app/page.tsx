"use client";

import { Card } from "@/components/app/card";
import { Section } from "@/components/app/section";
import { Select } from "@/components/app/select";

const options = [
 { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "ruby", label: "Ruby" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "golang", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "kotlin", label: "Kotlin" },
  { value: "swift", label: "Swift" },
  { value: "php", label: "PHP" },
  { value: "scala", label: "Scala" },
  { value: "elixir", label: "Elixir" },
  { value: "haskell", label: "Haskell" },
  { value: "clojure", label: "Clojure" },
  { value: "perl", label: "Perl" },
  { value: "r", label: "R" },
  { value: "shell", label: "Shell" },
  { value: "sql", label: "SQL" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
  { value: "dockerfile", label: "Dockerfile" },
];

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
    </div>
  );
}

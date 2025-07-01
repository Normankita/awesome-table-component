
````markdown
# 📊 Awesome Table Component

A reusable, responsive, and fully customizable **React table component** built with **Tailwind CSS**.  
Includes advanced features like **search**, **sorting**, **pagination**, **skeleton loading**, field transformations, and optional per-row actions. Ideal for dashboards and data-rich UIs.

---

## 🚀 Installation

```bash
npm install awesome-table-component
````

> ⚠️ **Peer Dependencies:** You must already have `react`, `react-dom`, `tailwindcss` and `react-loading-skeleton` installed in your project.

---

## ✨ Features

* ✅ Dynamic column sorting (ascending / descending)
* 🔍 Live search across all visible fields
* 🔄 Pagination with adjustable row count
* 🦴 Skeleton loading state
* ⚙️ Field transformation for advanced display control
* 🏷️ Custom header labels
* 🎯 Row-level action buttons (edit/delete/etc.)
* 🌙 Tailwind Dark Mode support

---

## 📦 Usage Example

```jsx
import { TableComponent } from 'awesome-table-component';

const data = [
  { name: 'Norman', email: 'norman@example.com', role: 'Admin' },
  { name: 'Jane', email: 'jane@example.com', role: 'User' },
];

const headers = ['name', 'email', 'role'];

<TableComponent
  title="User List"
  ItemData={data}
  headers={headers}
/>
```

---

## 🔧 Full Prop Reference

| Prop              | Type            | Description                                                      |
| ----------------- | --------------- | ---------------------------------------------------------------- |
| `ItemData`        | `Array<Object>` | Data to display in the table                                     |
| `headers`         | `Array<string>` | Fields to display as columns                                     |
| `title`           | `string`        | Table title                                                      |
| `isLoading`       | `boolean`       | Show skeletons if true                                           |
| `excludeFields`   | `Array<string>` | Fields to hide                                                   |
| `transformFields` | `Object`        | `{ field: (value, row) => string }` for transforming cell values |
| `headerLabels`    | `Object`        | `{ field: 'Custom Label' }` for renaming headers                 |
| `customActions`   | `Function(row)` | Renders custom JSX (e.g., edit/delete buttons) per row           |

---

## 🔨 Advanced Example

```jsx
const customActions = (row) => (
  <div className="flex gap-2">
    <button onClick={() => alert(`Edit ${row.name}`)} className="text-blue-600">Edit</button>
    <button onClick={() => alert(`Delete ${row.name}`)} className="text-red-600">Delete</button>
  </div>
);

const transformFields = {
  role: (val) => val.toUpperCase(),
};

const headerLabels = {
  name: 'Full Name',
  email: 'Email Address',
  role: 'User Role'
};

<TableComponent
  title="Accounts"
  ItemData={data}
  headers={['name', 'email', 'role']}
  transformFields={transformFields}
  headerLabels={headerLabels}
  customActions={customActions}
/>
```

---

## 🌐 Tailwind Configuration

Ensure your `tailwind.config.js` includes:

```js
content: [
  './src/**/*.{js,jsx}',
  './node_modules/awesome-table-component/src/**/*.{js,jsx}'
],
```

---

## 🖼️ Screenshot (Optional)

> You can add a screenshot of the table in use here if desired:
>
> ![Demo Screenshot](./screenshot.png)

---

## 📄 License

MIT License
Copyright (c) 2025
[Norman Leonard Kita](https://github.com/Normankita)



import { ContentMetadata } from "../lib/definitions";

type MetadataTableProps = {
  metadata: ContentMetadata;
};

const MetadataTable: React.FC<MetadataTableProps> = ({ metadata }) => {
  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Key</th>
          <th className="border border-gray-300 px-4 py-2">Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(metadata).map(([key, value]) => (
          <tr key={key}>
            <td className="border border-gray-300 px-4 py-2 font-medium">{key}</td>
            <td className="border border-gray-300 px-4 py-2">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MetadataTable;
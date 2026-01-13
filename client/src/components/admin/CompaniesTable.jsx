import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );

  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const result = companies.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name
        ?.toLowerCase()
        .includes(searchCompanyByText.toLowerCase());
    });

    setFilteredCompanies(result);
  }, [companies, searchCompanyByText]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
      <Table>
        <TableCaption className="text-gray-500 italic p-4">
          Registered companies
        </TableCaption>

        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold text-gray-700">Logo</TableHead>
            <TableHead className="font-semibold text-gray-700">Name</TableHead>
            <TableHead className="font-semibold text-gray-700">Date</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <TableRow
                key={company._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <Avatar className="h-10 w-10 ring-2 ring-gray-200">
                    <AvatarImage src={company.logo} alt={company.name} />
                  </Avatar>
                </TableCell>

                <TableCell className="font-medium text-gray-900">
                  {company.name}
                </TableCell>

                <TableCell className="text-gray-600">
                  {company.createdAt.split("T")[0]}
                </TableCell>

                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-gray-100 transition">
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent
                      align="end"
                      sideOffset={5}
                      className="w-36 p-1 shadow-xl border rounded-xl bg-white"
                    >
                      <div
                        onClick={() =>
                          navigate(`/admin/companies/${company._id}`)
                        }
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      >
                        <Edit2 className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Edit
                        </span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-6 text-gray-500"
              >
                No companies found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;

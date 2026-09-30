import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, ExternalLink, Globe } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TrustBadge from "../TrustBadge";
import { Button } from "../ui/button";

const CompaniesTable = () => {
  const { companies = [], searchCompanyByText = "" } = useSelector(
    (store) => store.company
  );

  const [filteredCompanies, setFilteredCompanies] = useState(companies);

  useEffect(() => {
    const result = companies.filter((company) => {
      if (!searchCompanyByText) return true;
      const term = searchCompanyByText.toLowerCase();
      return (
        company?.name?.toLowerCase().includes(term) ||
        company?.location?.toLowerCase().includes(term)
      );
    });

    setFilteredCompanies(result);
  }, [companies, searchCompanyByText]);

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
      <Table className="w-full text-left text-xs">
        <TableHeader className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
          <TableRow>
            <TableHead className="p-3.5">Logo</TableHead>
            <TableHead className="p-3.5">Company Name</TableHead>
            <TableHead className="p-3.5">Location</TableHead>
            <TableHead className="p-3.5">Trust Verification</TableHead>
            <TableHead className="p-3.5">Registered Date</TableHead>
            <TableHead className="p-3.5 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-slate-100">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <TableRow
                key={company._id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <TableCell className="p-3.5">
                  <Avatar className="h-9 w-9 rounded-xl border object-cover">
                    <AvatarImage src={company.logo} alt={company.name} />
                    <AvatarFallback className="bg-teal-600 text-white font-bold uppercase">{company.name?.charAt(0) || "C"}</AvatarFallback>
                  </Avatar>
                </TableCell>

                <TableCell className="p-3.5 font-bold text-slate-900">
                  <Link
                    to={`/company/${company._id}`}
                    className="hover:text-teal-600 transition"
                  >
                    {company.name}
                  </Link>
                </TableCell>

                <TableCell className="p-3.5 text-slate-500">
                  {company.location || "India"}
                </TableCell>

                <TableCell className="p-3.5">
                  <div className="flex items-center gap-2">
                    <TrustBadge trustLevel={company.trustLevel} />
                    {company.trustScore > 0 && (
                      <span className="text-[11px] font-bold text-amber-600">
                        {company.trustScore}/100
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="p-3.5 text-slate-500">
                  {company.createdAt?.split("T")[0]}
                </TableCell>

                <TableCell className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link to={`/admin/companies/${company._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2.5 text-xs font-semibold text-teal-600"
                      >
                        Edit Profile
                      </Button>
                    </Link>

                    <Link to={`/company/${company._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-slate-400 hover:text-slate-700"
                        title="View Public Profile"
                      >
                        <ExternalLink size={14} />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                No companies registered yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;

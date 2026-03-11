import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class TreasuryExportService {

  async generateTransactionsExcel(transactions: any[]): Promise<Buffer> {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    // Columns
    worksheet.columns = [
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Source', key: 'source', width: 20 },
      { header: 'Deal', key: 'deal', width: 25 },
      { header: 'Sales Agent', key: 'agent', width: 25 },
      { header: 'Created By', key: 'createdBy', width: 25 },
      { header: 'Role', key: 'role', width: 25 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Notes', key: 'notes', width: 30 },
    ];

    // Header style
    worksheet.getRow(1).font = { bold: true };

    transactions.forEach((t) => {
      worksheet.addRow({
        type: t.type,
        amount: t.amount,
        category: t.category,
        source: t.source,
        deal: t.linkedDeal?.title ?? '-',
        agent: t.salesAgent?.fullName ?? '-',
        createdBy: t.createdBy?.fullName ?? '-',
        role: t.createdBy?.role ?? '-',
        date: t.date ? new Date(t.date) : '-',
        notes: t.notes ?? '',
      });
    });

    // Format currency
    worksheet.getColumn('amount').numFmt = '#,##0.00';

    // Format date
    worksheet.getColumn('date').numFmt = 'yyyy-mm-dd';

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
  }
}
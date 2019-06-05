import { Injectable } from '@angular/core';
import { VatCategory, VatCategoriesService } from './vat-categories.service';

export interface InvoiceLine {
  product: string;
  vatCategory: VatCategory;
  priceInclusiveVat: number;
}

export interface InvoiceLineComplete extends InvoiceLine {
  priceExclusiveVat: number;
}

export interface Invoice {
  invoiceLines: InvoiceLineComplete[];
  totalPriceInclusiveVat: number;
  totalPriceExclusiveVat: number;
  totalVat: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceCalculatorService {

  constructor(private vatCategoriesService: VatCategoriesService) { }

  public CalculatePriceExclusiveVat(priceInclusiveVat: number, vatPercentage: number): number {
    // REPLACE the next line with the necessary code
    if (priceInclusiveVat < 0) {
      priceInclusiveVat *= -1;
    }
    return priceInclusiveVat / (1 + vatPercentage / 100);
  }

  public CalculateInvoice(invoiceLines: InvoiceLine[]): Invoice {
    // REPLACE the next line with the necessary code
    const complete: InvoiceLineComplete[] = [];
    const inv: Invoice = { invoiceLines: complete, totalPriceInclusiveVat: 0, totalPriceExclusiveVat: 0, totalVat: 0 };
    for (const invoiceLine of invoiceLines) {
      // tslint:disable-next-line:max-line-length
      const priceExclVat = this.CalculatePriceExclusiveVat(invoiceLine.priceInclusiveVat, this.vatCategoriesService.getVat(invoiceLine.vatCategory));
      const invLineComplete: InvoiceLineComplete = {
        product: invoiceLine.product, vatCategory: invoiceLine.vatCategory,
        priceInclusiveVat: invoiceLine.priceInclusiveVat,
        priceExclusiveVat: priceExclVat
      };

      complete.push(invLineComplete);

      inv.totalPriceExclusiveVat += priceExclVat;
      inv.totalPriceInclusiveVat += invoiceLine.priceInclusiveVat;
      inv.totalVat += invoiceLine.priceInclusiveVat - priceExclVat;
    }
    return inv;
  }
}

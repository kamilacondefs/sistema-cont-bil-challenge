import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Balancete } from '../../../../core/models/balancete.model';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-resumo-cards',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './resumo-cards.component.html',
  styleUrls: ['./resumo-cards.component.scss']
})
export class ResumoCardsComponent {
  @Input() balancete: Balancete | null = null;
}

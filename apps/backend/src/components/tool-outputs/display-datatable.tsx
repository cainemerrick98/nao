import type { displayDatatable } from '@nao/shared/tools';

import { Block } from '../../lib/markdown';

export function DisplayDatatableOutput({ output }: { output: displayDatatable.Output }) {
	if (output.error) {
		return <Block>Could not display the datatable: {output.error}</Block>;
	}
	return <Block>Datatable displayed successfully.</Block>;
}

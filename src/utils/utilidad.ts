
//* formats for date
export function formatDate(isoString: string): string {
    const date = new Date(isoString)
    const formatter = new Intl.DateTimeFormat("es-NI", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
    })
    return formatter.format(date)
}

export function formatDateDayMonthYear(isoString: string): string {
    const date = new Date(isoString);
    const day = String(date.getDate() + 1).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export function formatDateByDataBase(date: Date) {
    const nuevoAño = date.getFullYear();
    const nuevoMes = String(date.getMonth() + 1).padStart(2, '0');
    const nuevoDia = String(date.getDate() + 1).padStart(2, '0');

    const dateByDataBase = nuevoAño + "-" + nuevoMes + "-" + nuevoDia;

    return dateByDataBase
}

export function formatDateInput(date: string): string {
    const [dia, mes, ano] = date.split('/');

    // 3. Reordenamos a formato AAAA-MM-DD (ISO)
    const formatoIso = `${ano}-${mes}-${dia}`;

    // 4. Actualizamos el estado
    return formatoIso;
}

export function formatWeekDate() {
    const hoy = new Date();

    // Calcula el lunes de la semana actual
    const diaSemana = hoy.getDay();
    const diferencia = hoy.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
    const lunes = new Date(hoy.setDate(diferencia));

    // Calcula el domingo sumando 6 días al lunes
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    // Formato de fecha (ej. DD/MM/YYYY)
    const opciones: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

    return `del ${lunes.toLocaleDateString('es-ES', opciones)} al ${domingo.toLocaleDateString('es-ES', opciones)}`;
}


//* formats for currency
export function formatCurrency(value: string): string {
    return new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO"
    }).format(parseFloat(value))
}


//* formats for number
export function formatNumber(value: string): string {
    return new Intl.NumberFormat("es-NI").format(parseFloat(value))
}


//* formats for percentaje
export function formatPercentage(value: string): string {
    return new Intl.NumberFormat("es-NI", {
        style: "percent",
        minimumFractionDigits: 2
    }).format(parseFloat(value))
}


//* create formatted number and date for id customers random
export function createFormattedIdCustomer() {
    const numberRandom = Math.floor(Math.random() * 1000);
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');

    const idCustomer = numberRandom + formattedDate;

    return idCustomer;
}

//* create formatted number and date for id temp random
export function createFormattedIdTemp() {
    const numberRandom = Math.floor(Math.random() * 1000);
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');

    const idCustomer = numberRandom + formattedDate;

    return idCustomer;
}
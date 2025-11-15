

const mapPersonToPuuid: { [key: string]: string } = {
    'TYLA': process.env.TYLA_PUUID as string,
    'CORBEN': process.env.CORBEN_PUUID as string,
};

export default mapPersonToPuuid;
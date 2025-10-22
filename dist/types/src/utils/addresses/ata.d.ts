import { Address, AddressLike } from '../../domains';
/**
 * Return the associated token account for given params
 *
 * @param walletAddress
 * @param tokenMintAddress
 * @param tokenProgramId
 */
export declare function getAta(walletAddress: AddressLike, tokenMintAddress: AddressLike, tokenProgramId: AddressLike): Address;

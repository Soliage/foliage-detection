# foliage-detection
MVP to detect level of foliage in an image. For each parcel NFT, it does the following:
1. Removes haze using the `Single Image Haze Removal Using Dark Channel Prior` created by BLKStone.
2. Arranges the image color, detecting the trees from the remaining content and returns the percentage of foliage.
3. Queries for the current owner of the NFT parcel using getProgramAccounts.
4. Calculates the program derived account of the parcel NFT being analyzed using findProgramAddressSync.
5. Gets the carbon offset token (COT) account for the parcel owner using getOrCreateTokenBag.
6. Submits the value and owner to the program derived account which mints COT directly into the owner's token account.

![Screenshot 2023-03-10 at 14-12-40 forest_v3 - Jupyter Notebook](https://user-images.githubusercontent.com/72612765/224338059-62a52f13-13d6-4ef0-8c8e-6ab1b4a3d52c.png)


## Quickstart:
`python -m venv venv`
`python -m ensurepip --upgrade`
`pip install -r requirements.txt`
`source PATH/TO/WORKING/DIRECTORY/foliage-detection/venv/bin/activate`

Make sure that you have run the @soliage/token-generator in localhost and have generated a tokens.json file which you have copied over to ./data/tokens.json in this repo. Otherwise, you will get an error "Error: No accounts found for token 4zQYVjemiCUb9RxENk2g8EncrTm97BND2z4DiDahA3UM."

`npm start`

#include <iostream>
#include <vector>
#include <climits>
using std::swap;
using std::vector;
using std::cout;
using namespace std;

int partitionOfDigits(vector<long long int> &digitOfNumber, int lowestIndex, int highestIndex)
{
    int pivotPoint = digitOfNumber[highestIndex];
    int iterationIndex1 = (lowestIndex - 1);
    try
    {
        for (int iterationIndex2 = lowestIndex; iterationIndex2 <= highestIndex; iterationIndex2++)
        {
            if (digitOfNumber[iterationIndex2] < pivotPoint)
            {
                iterationIndex1++;
                swap(digitOfNumber[iterationIndex1], digitOfNumber[iterationIndex2]);
            }
        }
        swap(digitOfNumber[iterationIndex1 + 1], digitOfNumber[highestIndex]);
    }
    catch (...)
    {
        std::cerr << "This function is not accessible" << '\n';
    }
    return (iterationIndex1 + 1);
}

void quickSort(vector<long long int> &digitOfNumber, int lowestIndex, int highestIndex)
{
    try
    {
        if (lowestIndex < highestIndex)
        {
            int partitionIndex = partitionOfDigits(digitOfNumber, lowestIndex, highestIndex);

            quickSort(digitOfNumber, lowestIndex, partitionIndex - 1);
            quickSort(digitOfNumber, partitionIndex + 1, highestIndex);
        }
    }
    catch (...)
    {
        std::cerr << "This function is not accessible" << '\n';
    }
}

vector<long long int> sortDigits(vector<long long int> digitOfNumber)
{
    try
    {
        quickSort(digitOfNumber, 0, (digitOfNumber.size() - 1));
    }
    catch (...)
    {
        std::cerr << "This function is not accessible" << '\n';
    }
    return digitOfNumber;
}

vector<long long int> convertNumberIntoVector(long long int fourDigitNumber)
{
    std::vector<long long int> digitOfNumber;
    try
    {
        while (fourDigitNumber != 0)
        {
            digitOfNumber.push_back(fourDigitNumber % 10);
            fourDigitNumber = fourDigitNumber / 10;
        }
    }
    catch (...)
    {
        std::cerr << "This function is not accessible" << '\n';
    }
    return digitOfNumber;
}

long long int arrangeInAsscendingOrder(long long int fourDigitNumber)
{
    long long asscendingNumber = 0;
    try
    {
        vector<long long int> digitOfNumber = convertNumberIntoVector(fourDigitNumber);
        int len = digitOfNumber.size();
        vector<long long int> sortedDigitofNumber = sortDigits(digitOfNumber);
        for (int i = 0; i < len; i++)
        {
            asscendingNumber = (asscendingNumber * 10) + sortedDigitofNumber[i];
        }
    }
    catch (...)
    {
        std::cerr << "This function is not accessible" << '\n';
    }
    return asscendingNumber;
}

long long int arrangeInDescendingOrder(long long int fourDigitNumber)
{
    long long descendingNumber = 0;
    try
    {
        vector<long long int> digitOfNumber = convertNumberIntoVector(fourDigitNumber);
        int len = digitOfNumber.size();
        vector<long long int> sortedDigitofNumber = sortDigits(digitOfNumber);
        for (int i = len - 1; i >= 0; i--)
        {
            descendingNumber = (descendingNumber * 10) + sortedDigitofNumber[i];
        }
    }
    catch (...)
    {
        std::cerr << "This function is not accessible" << '\n';
    }
    return descendingNumber;
}

void kaprekarConstant(long long int fourDigitNumber)
{
    try
    {
        cout << "Different Iterations of Kaprekar Constant : " << endl;
        long long int prevDifference = INT_MAX;
        long long int currDifference = INT_MAX;
        while ((prevDifference != 6174) && (currDifference != 6174) && (currDifference > 6174 && prevDifference > 6174))
        {
            long long int descendingNumber = arrangeInAsscendingOrder(fourDigitNumber);
            long long int asscendingNumber = arrangeInDescendingOrder(fourDigitNumber);
            prevDifference = currDifference;
            currDifference = descendingNumber - asscendingNumber;
            fourDigitNumber = currDifference;
            cout << descendingNumber << " - " << asscendingNumber << " = " << currDifference << endl;
        }
        if (fourDigitNumber != 6174)
        {
            cout << "Number is not follow Kaprekar Constant" << endl;
        }
        else
        {
            cout << "7641"
                 << " - "
                 << "1467"
                 << " = "
                 << "6174" << endl;
            cout << endl;
            cout << "Number follow Kaprekar Constant" << endl;
        }
    }
    catch (...)
    {
        std::cerr << "This function is not accessible" << '\n';
    }
}